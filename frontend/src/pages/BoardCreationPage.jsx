import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  addBoard,
  deleteBoard,
  fetchBoards,
} from "../features/boards/boardSlice";
import BoardCard from "../components/boards/BoardCard";
import CreateBoardCard from "../components/boards/CreateBoardCard";
import BoardModal from "../components/boards/BoardModal";
import { backgroundImages } from "../components/boards/constants";
import { useEffect } from "react";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import CollaborateSection from "../components/boards/CollaborateSection";

const BoardCreationPage = () => {
  const dispatch = useDispatch();
  const boardsRaw = useSelector((state) => state.board.boardList);
  const boards = Array.isArray(boardsRaw.boards) ? boardsRaw.boards : [];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "active",
  });

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchBoards(user.id));
    }
  }, [dispatch, user?.id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (formData.title.trim()) {
      const resultAction = dispatch(
        addBoard({
          title: formData.title,
          description: formData.description,
          owner: user?.email || "",
          status: formData.status,
          userId: user?.id,
        })
      );
      dispatch(fetchBoards(user.id));

      setFormData({ title: "", description: "", status: "active" });
      setIsModalOpen(false);
    }
  };

  const handleDeleteBoard = (id) => {
    if (window.confirm("Do You Want To Delete The Board?")) {
      dispatch(deleteBoard(id));
    }
  };

  const CreatePageNavbar = () => {
    return (
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800 mb-2">
              Create Boards
            </h1>
            <p className="text-gray-600 text-sm">
              Organize your projects and stay productive
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-100 to-white p-6">
      <CreatePageNavbar />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {boards.map((board, index) => (
            <BoardCard
              key={index}
              board={board}
              index={index}
              backgroundImages={backgroundImages}
              onDelete={handleDeleteBoard}
            />
          ))}
          <CreateBoardCard onClick={() => setIsModalOpen(true)} />
        </div>
        <CollaborateSection />
      </div>

      {isModalOpen && (
        <BoardModal
          formData={formData}
          onChange={handleInputChange}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
};

export default BoardCreationPage;
