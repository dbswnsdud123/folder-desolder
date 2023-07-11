import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import FolderDesolder from "../views/FolderDesolder.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: FolderDesolder,
  },
  {
    path: "/Folder-Desolder",
    name: "Folder Desolder",
    component: FolderDesolder,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
