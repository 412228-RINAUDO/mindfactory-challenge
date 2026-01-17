import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { Layout } from "./components/Layout"
import { PostsPage } from "./pages/PostsPage"

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/posts",
        element: <PostsPage />,
      },
    ],
  },
])

export function AppRoutes() {
  return <RouterProvider router={router} />
}
