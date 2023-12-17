import { Entity, Vector3, world } from "@minecraft/server";

export class DynamicProperty<T extends any | Vector3> {
  /**
   * Identifier for this dynamic property
   */
  identifier: string;

  /**
   * The root type of this property, this is the type that is saved in
   * the raw data, it is not related to {@link T}
   */
  rootType: "number" | "boolean" | "string" | "vector" | "object";

  /**
   * If this dynamic property should be registered globally available for the world.
   */
  isWorldDynamic: boolean;

  constructor(
    id: string,
    rootType: "number" | "boolean" | "string" | "vector" | "object"
  ) {
    this.identifier = id;
    this.rootType = rootType;
  }

  /**
   * Compiles a value to a base type
   * @param value value to compile
   * @returns value converted to base type
   */
  private compile(value: T): number | boolean | string | Vector3 {
    if (typeof value == "number") return value;
    if (typeof value == "boolean") return value;
    if (typeof value == "string") return value;
    if (this.rootType == "vector") return value as Vector3;
    return JSON.stringify(value);
  }

  /**
   * Un-compile a value from {@link compile}
   * @param value
   * @returns un-compiled value
   */
  private unCompile(
    value: number | boolean | string | Vector3 | undefined
  ): T | undefined {
    if (value == undefined) return undefined;
    if (["boolean", "number", "string", "vector"].includes(this.rootType))
      return value as T;
    return JSON.parse(value as string) as T;
  }

  /**
   * Sets this property as world dynamic
   * @param value
   */
  setWorldDynamic(value: boolean = true): DynamicProperty<T> {
    this.isWorldDynamic = value;
    return this;
  }

  /**
   * Gets this dynamic property from a entity or world
   * @param entity Entity to grab from, if null it will grab from world
   * @throws if entity is null and this dynamic property isn't world Dynamic.
   */
  get(entity?: Entity): T | undefined {
    try {
      if (entity)
        return this.unCompile(entity.getDynamicProperty(this.identifier));
      if (!this.isWorldDynamic)
        throw new Error(`${this.identifier} Is not World Dynamic!`);
      return this.unCompile(world.getDynamicProperty(this.identifier));
    } catch (error) {
      return undefined;
    }
  }

  /**
   * Sets this dynamic property to a value on entity or world
   * @param value value to set to
   * @param entity if entity is specified it will set it on a entity
   * @throws if no entity is specified and this is not world dynamic
   * @throws if entity is specified and the entity is not a valid entity type on this
   */
  set(value: T | undefined, entity?: Entity) {
    let parsedValue = value ? this.compile(value) : undefined;
    if (entity) {
      if (!entity.isValid())
        throw new Error(
          `Failed to set Dynamic Property: ${this.identifier} on: ${entity.id}, Entity is not Valid`
        );
      try {
        entity.setDynamicProperty(this.identifier, parsedValue);
      } catch (error) {
        console.warn(
          `[Dynamic Property Wrapper] Failed to set ${this.identifier} on: ${
            entity.id
          }, ${error + error.stack}`
        );
      }
    } else {
      if (!this.isWorldDynamic)
        throw new Error(`${this.identifier} Is not World Dynamic!`);
      try {
        world.setDynamicProperty(this.identifier, parsedValue);
      } catch (error) {
        console.warn(
          `[Dynamic Property Wrapper] Failed to set Dynamic Property on: World, ${
            error + error.stack
          }`
        );
      }
    }
  }

  /**
   * Removes this dynamic property on entity or world
   * @param entity if entity is specified it will set it on a entity
   * @throws if no entity is specified and this is not world dynamic
   * @throws if entity is specified and the entity is not a valid entity type on this
   * @returns if it has successfully removed the dynamic property
   */
  remove(entity?: Entity) {
    this.set(undefined, entity);
  }
}
