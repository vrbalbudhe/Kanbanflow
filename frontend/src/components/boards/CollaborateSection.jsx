import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllBoards } from "../../features/boards/boardSlice";
import { AuthContext } from "../../contexts/AuthContext";
import { backgroundImages } from "../../components/boards/constants";
import BoardCard from "./BoardCard";
import { BadgeAlert } from "lucide-react";

function CollaborateSection() {
  const { user } = useContext(AuthContext);
  const [collaborators, setCollaborators] = useState();
  const dispatch = useDispatch();
  const boards = useSelector((state) => state?.board?.allBoards);
  //   console.log("boards:", boards);

  const collaborateBoards = boards.filter((board) =>
    board?.participants?.some(
      (participant) => participant?.email === user?.email
    )
  );
  const handleDeleteBoard = (id) => {
    if (window.confirm("Do You Want To Delete The Board?")) {
      dispatch(deleteBoard(id));
    }
  };

  useEffect(() => {
    dispatch(fetchAllBoards());
  }, []);

  const CreatePageNavbar = () => {
    return (
      <div className="max-w-7xl mx-auto mb-8 mt-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800 mb-2">
              Collaborations
            </h1>
            <p className="text-gray-600 text-sm">
              Collaboaration Boards Will Be Displayed Below
            </p>
          </div>
        </div>
      </div>
    );
  };

  const HandleNoCollaborationBoards = () => {
    return (
      <div className="w-full pointer-events-none select-none h-60 flex flex-col gap-5 justify-center items-center">
        <span className=" text-slate-700">
          <BadgeAlert size={80} strokeWidth={1} />
        </span>
        <p className="italic text-md">No Collaboration Boards Found</p>
      </div>
    );
  };

  return (
    <div>
      <CreatePageNavbar />
      {collaborateBoards.length > 0 && (
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {collaborateBoards.map((board, index) => (
              <BoardCard
                key={index}
                board={board}
                index={index}
                backgroundImages={backgroundImages}
                onDelete={handleDeleteBoard}
              />
            ))}
          </div>
        </div>
      )}
      {collaborateBoards.length === 0 && HandleNoCollaborationBoards()}
    </div>
  );
}

export default CollaborateSection;
