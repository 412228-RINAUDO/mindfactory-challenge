import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { Layout } from "./components/Layout"
import { PrivateRoutes } from "./components/PrivateRoutes"
import { PostsPage } from "./pages/PostsPage"
import { PostDetailPage } from "./pages/PostDetailPage"
import { CreatePostPage } from "./pages/CreatePostPage"
import { EditPostPage } from "./pages/EditPostPage"
import { LoginPage } from "./pages/LoginPage"
import { SignUpPage } from "./pages/SignUpPage"
import { ProfilePage } from "./pages/ProfilePage"
import { ProfileEditPage } from "./pages/ProfileEditPage"

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <PostsPage />,
      },
      {
        path: "/posts/:id",
        element: <PostDetailPage />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/register",
        element: <SignUpPage />,
      },
      {
        element: <PrivateRoutes />,
        children: [
          {
            path: "/posts/create",
            element: <CreatePostPage />,
          },
          {
            path: "/posts/:id/edit",
            element: <EditPostPage />,
          },
          {
            path: "/profile/:id",
            element: <ProfilePage />,
          },
          {
            path: "/profile/:id/edit",
            element: <ProfileEditPage />,
          },
        ],
      },
    ],
  },
])

export function AppRoutes() {
  return <RouterProvider router={router} />
}
