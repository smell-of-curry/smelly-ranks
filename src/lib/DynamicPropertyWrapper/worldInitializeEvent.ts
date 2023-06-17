import { world } from "@minecraft/server";
import { DynamicProperty } from "./DynamicProperty";

/**
 * An array of all active commands
 */
export const DYNAMIC_PROPERTIES: DynamicProperty<any>[] = [];

world.afterEvents.worldInitialize.subscribe(({ propertyRegistry }) => {
  for (const property of DYNAMIC_PROPERTIES) {
    for (const entityType of property.entityTypes) {
      propertyRegistry.registerEntityTypeDynamicProperties(
        property.definition,
        entityType
      );
    }
    if (property.isWorldDynamic)
      propertyRegistry.registerWorldDynamicProperties(property.definition);
  }
});
