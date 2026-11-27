import { Suspense } from "react";
import { RoomFormScreen } from "../../../../../components/dashboard/RoomFormScreen";

export default function EditRoomPage({ params }: { params: Promise<{ id: string }> }) {
  return <Suspense fallback={null}>{params.then(({ id }) => <RoomFormScreen roomId={id} />)}</Suspense>;
}
