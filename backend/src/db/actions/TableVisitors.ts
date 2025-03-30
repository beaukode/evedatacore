import { $add, UpdateItemCommand } from "dynamodb-toolbox";
import { VisitorEntity } from "../schema/TableVisitors";

export async function incrementEvents(eventDay: string, userId: string, count: number) {
  return VisitorEntity.build(UpdateItemCommand)
    .item({
      uid: userId,
      day: eventDay,
      eventsCount: $add(count),
    })
    .send();
}
