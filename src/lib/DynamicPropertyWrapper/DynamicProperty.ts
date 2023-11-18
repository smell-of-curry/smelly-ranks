import { Entity, EntityType, Vector3, world } from "@minecraft/server";
import { DYNAMIC_PROPERTIES } from "./worldInitializeEvent";

export class DynamicProperty<T extends any> {
  /**
   * Identifier for this dynamic property
   */
  identifier: string;

  /**
   * The root type of this property, this is the type that is saved in
   * the raw data, it is not related to {@link T}
   */
  rootType: "number" | "boolean" | "string" | "object";

  /**
   * If this dynamic property should be registered globally available for the world.
   */
  isWorldDynamic!: boolean;

  /**
   * The entityTypes that this dynamic property is registered on
   */
  entityTypes: EntityType[];

  constructor(id: string, rootType: "number" | "boolean" | "string" | "object") {
    this.identifier = id;
    this.rootType = rootType;
    this.entityTypes = [];

    DYNAMIC_PROPERTIES.push(this);
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
    return JSON.stringify(value);
  }

  /**
   * Un-compile a value from {@link compile}
   * @param value
   * @returns un-compiled value
   */
  private unCompile(value: number | boolean | string | undefined | Vector3): T | undefined {
    if (value == undefined) return undefined;
    if (["boolean", "number", "string", "Vector3"].includes(this.rootType)) return value as T;
    return JSON.parse(value as string) as T;
  }

  /**
   * Registers this dynamic property for a list of entities
   * @param entityTypes
   */
  registerEntityTypes(entityTypes: EntityType[]): DynamicProperty<T> {
    this.entityTypes = this.entityTypes.concat(entityTypes);
    return this;
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
      if (entity) return this.unCompile(entity.getDynamicProperty(this.identifier));
      if (!this.isWorldDynamic) throw new Error(`${this.identifier} Is not World Dynamic!`);
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
  set(value: T, entity?: Entity) {
    let parsedValue = this.compile(value);
    if (entity) {
      const typeId = entity.typeId; // Reduces Entity.typeId calls.
      if (!this.entityTypes.find((t) => t.id == typeId))
        throw new Error(`${entity.id} Is not a registered entity type for ${this.identifier}!`);
      entity.setDynamicProperty(this.identifier, parsedValue);
    } else {
      if (!this.isWorldDynamic) throw new Error(`${this.identifier} Is not World Dynamic!`);
      world.setDynamicProperty(this.identifier, parsedValue);
    }
  }

  /**
   * Removes this dynamic property on entity or world
   * @param value value to set to
   * @param entity if entity is specified it will set it on a entity
   * @throws if no entity is specified and this is not world dynamic
   * @throws if entity is specified and the entity is not a valid entity type on this
   * @returns if it has successfully removed the dynamic property
   */
  remove(entity?: Entity): void {
    if (entity) {
      const typeId = entity.typeId; // Reduces Entity.typeId calls.
      if (!this.entityTypes.find((t) => t.id == typeId))
        throw new Error(`${entity.id} Is not a registered entity type for ${this.identifier}!`);
      return entity.setDynamicProperty(this.identifier, undefined);
    } else {
      if (!this.isWorldDynamic) throw new Error(`${this.identifier} Is not World Dynamic!`);
      return world.setDynamicProperty(this.identifier, undefined);
    }
  }
}
