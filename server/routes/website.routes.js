import express from "express"

import isAuth from "../middlewares/isAuth.js"
import optionalAuth from "../middlewares/optionalAuth.js"
import { changes, deleteWebsite, deploy, generateWebsite, getAll, getBySlug, getWebsiteById } from "../controllers/website.controllers.js"


const websiteRouter=express.Router()

websiteRouter.post("/generate",isAuth, generateWebsite)
websiteRouter.post("/update/:id",isAuth,changes)
websiteRouter.get("/get-by-id/:id",isAuth,getWebsiteById)
websiteRouter.get("/get-all",optionalAuth,getAll)
websiteRouter.get("/deploy/:id",isAuth,deploy)
websiteRouter.delete("/delete/:id",isAuth,deleteWebsite)
websiteRouter.get("/get-by-slug/:slug",getBySlug)

export default websiteRouter