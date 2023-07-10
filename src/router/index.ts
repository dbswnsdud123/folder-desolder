import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import ImageDesolder from "../views/ImageDesolder.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: ImageDesolder,
  },
  {
    path: "/Image-Desolder",
    name: "Image Desolder",
    component: ImageDesolder,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
