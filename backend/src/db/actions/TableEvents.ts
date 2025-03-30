import { $add, $set, UpdateItemCommand } from "dynamodb-toolbox";
import { EventEntity } from "../schema/TableEvents";

export async function incrementEvent(eventKey: string, eventDay: string, userId: string, count: number) {
  return EventEntity.build(UpdateItemCommand)
    .item({
      key: eventKey,
      day: eventDay,
      count: $add(count),
      visitors: $set({ [userId]: 1 }),
    })
    .send();
}
