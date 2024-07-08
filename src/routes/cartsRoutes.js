import { Router } from "express";
import config from "../config.js";
import CartController from "../controller/cart.controller.js";

const controller = new CartController()
const router = Router()

router.get("/", async (req, res) => {
    try {
        const carts = await controller.get()

        res.status(200).send({ origin: config.SERVER, payload: carts });
    } catch (err) {
        res.status(500).send({ origin: config.SERVER, payload: null});
    }
})

router.get("/:cid", async (req, res) => {
    try {
        const cid = req.params.cid
        const cart = await controller.getById(cid)

        res.status(200).send({origin: config.SERVER, payload: cart})
    } catch (error) {
        res.status(500).send({origin: config.SERVER, payload: null})
    }
})

router.post("/", async (req, res) => {
    try {
        const cart = await controller.add(req.body)     
            res.status(200).send({ origin: config.SERVER, payload: cart });
    } catch (error) {
        res.status(500).send({ origin: config.SERVER, payload: null})
    }
})

//vacia el carrito completo
router.delete("/:cid", async (req, res) => {
    try {
        const cid = {_id : req.params.cid } 
        await controller.delete(cid);
        console.log(`se vacio el carrito`);
        
        res.status(200).send({ origin: config.SERVER, payload: "carrito vacio" });
    } catch (error) {
        res.status(500).send({origin: config.SERVER, payload: null})
    }
})

// eliminar el producto especifico del array
router.delete("/:cid/products/:pid", async (req, res) => {
    try {
        const cid = req.params.cid
        const pid = req.params.pid
        const cart = await controller.deleteProductInCart(cid,pid)
        
        res.status(200).send({ payload: cart });
    } catch (error) {
        res.status(500).send({ origin: config.SERVER, payload: null})
    }
})

// actualiza el array de products con un nuevo array recibido por req.body
router.put("/:cid", async (req, res) => {
    try {
        const filter = { _id: req.params.cid };
        const update = req.body;
        const options = { new: true };
        const cart = await controller.updateProducts(filter, update, options);
        
        res.status(200).send({ origin: config.SERVER, payload: cart });
    } catch (error) {
        res.status(500).send({origin: config.SERVER, payload: null})
    }
})

//actualiza el qty del producto especificado dentro del array de products con la cantidad especificada en req.body
router.put("/:cid/products/:pid", async (req, res) => {
    const filterCart = { _id: req.params.cid }
    const update = req.body
    const options = { new :true }
    const filterProduct = req.params.pid
    const cart = await controller.updateQty(filterCart,update,options,filterProduct)

    res.status(200).send({ origin: config.SERVER, payload: cart });
})

router.post("/addProduct", async (req, res) => {
    try {
        //verifico si existe un usuario logueado
        if (req.session.user) {
            const data = req.body
            console.log(data);
            //recupero el id del ususario logueado
            const filter = {_user_id :req.session.user._id}
            console.log(filter);
            //ejecuto el manager para agregar al carrito
            const cart = await controller.addProductInCart(data,filter)  
    
            return res.redirect("/cart") 
        }
    
        res.redirect("/login")
    } catch (error) {
        res.status(500).send({ origin: config.SERVER, payload: error });
    }
})


export default router