import express from 'express'
import { PrismaClient } from '@prisma/client'

const app = express()
app.use(express.json())
const prisma = new PrismaClient()

const logRequest = (req, res, next) => {
    console.log(`Method: ${req.method}, URL: ${req.url}`);
    next();
};

app.use(logRequest);

const verifyOrderIdExists = async (req, res, next) => {
    const order = await prisma.client.findUnique({
        where: {
            id: req.params.id
        }
    })

    if(!order){
        return res.status(404).json({ error: 'ID not found' })
    }
    next()
    
}

app.use('/order/:id', verifyOrderIdExists);


app.post('/order', async (req, res) => {
    const order = await prisma.client.create({
        data: {
            order: req.body.order,
            clientName: req.body.clientName,
            price: req.body.price,
            status: 'Em preparação'
        }
    })
    res.status(201).json(order)
})

app.get('/order', async (req, res) => {
    const orders = await prisma.client.findMany()
    res.status(200).json(orders)
})

app.put('/order/:id', async (req, res) => {
    const order = await prisma.client.update({
        where: {
            id: req.params.id
        },
        data: {
            order: req.body.order,
            clientName: req.body.clientName,
            price: req.body.price
        }
    })
    res.status(200).json(order)
})

app.delete('/order/:id', async (req, res) => {
    await prisma.client.delete({
        where: {
            id: req.params.id
        }
    })
    res.status(200).json({message: 'Ordem deletada!'})
})

app.get('/order/:id', async (req, res) => {
    const order = await prisma.client.findUnique({
        where: {
            id: req.params.id
        }
    })
    res.status(200).json(order)
})

app.patch('/order/:id', async (req, res) => {
    const order = await prisma.client.update({
        where: {
            id: req.params.id
        },
        data: {
            status: 'Pronto'
        }
    })
    res.status(200).json(order)
})


app.listen(3000)