import { Router } from "express";

const router = Router();

router.get('/index', (req, res) => {
    res.render('index', {
        style: "index.css"
    })
})

export default router;