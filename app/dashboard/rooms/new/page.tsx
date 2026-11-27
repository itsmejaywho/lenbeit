import { Suspense } from "react";
import { RoomFormScreen } from "../../../../components/dashboard/RoomFormScreen";

export default function NewRoomPage() {
  return <Suspense fallback={null}><RoomFormScreen /></Suspense>;
}
