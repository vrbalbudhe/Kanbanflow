import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { PublicLayout } from "./layouts/PublicLayout";
import Homepage from "./pages/Homepage";
import BoardCreationPage from "./pages/BoardCreationPage";
import { ProtectedLayout } from "./layouts/ProtectedLayout";
import { CreationLayout } from "./layouts/CreationLayout";
import UserProfile from "./pages/UserPages/UserProfile";
import UserSettings from "./pages/UserPages/UserSettings";
import KanbanDashboard from "./pages/KanbanDashboard";
import MembersPage from "./pages/KanbanPages/MembersPage";
import DiscussionPage from "./pages/KanbanPages/DiscussionPage";
import CalenderPage from "./pages/KanbanPages/CalenderPage";
import ChatPage from "./pages/KanbanPages/ChatPage";
import ArchivePage from "./pages/KanbanPages/ArchivePage";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <PublicLayout />,
      children: [
        {
          path: "/",
          element: <Homepage />,
        },
      ],
    },
    {
      path: "/secure",
      element: <ProtectedLayout />,
      children: [
        {
          path: "board",
          element: <BoardCreationPage />,
        },
        {
          path: "profile",
          element: <UserProfile />,
        },
        {
          path: "settings",
          element: <UserSettings />,
        },
      ],
    },
    {
      path: "/kanban/:id",
      element: <CreationLayout />,
      children: [
        {
          path: "home",
          element: <KanbanDashboard />,
        },
        {
          path: "chat/:chatId",
          element: <ChatPage />,
        },
        {
          path: "members",
          element: <MembersPage />,
        },
        {
          path: "calender",
          element: <CalenderPage />,
        },
        {
          path: "discussion",
          element: <DiscussionPage />,
        },
        {
          path: "archive",
          element: <ArchivePage />,
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;

/*

  <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/boards" element={<Homepage />} />
          <Route path="/board/:id" element={<KanbanDashboard />} />
        </Routes>
      </BrowserRouter>
    </Provider>
*/
