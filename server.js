import express from 'express'
import connectDB from "./config/db.js";
import olxWorker from './index.js'
import HomePageAds from "./model/HomePageAds.js";


connectDB()

const app = express()
olxWorker()

  app.get('/', (req, res) => {
      res.send('API is running...')
  })

  app.get('/list', async (req, res) => {

      try {
          const products = await HomePageAds.find({})
          if (!products) {
              return res.status(404).json({
                  error: {
                    code: 404,
                    message: 'Products not found',
                  },
              })
          }
          res.status(200).send(products);
      } catch (e) {
          res.status(500).json({
              error: {
                code: 500,
                message: error.message || 'An error occurred',
              },
          });
      }
  })

  app.get('/:id', async (req, res) => {
      try {
          const product = await HomePageAds.findById(req.params.id)
              if (!product) {
                  return res.status(404).json({
                      error: {
                        code: 404,
                        message: 'Task not found',
                      },
                  })
              }
        res.status(200).send(product);

      } catch (e) {
          res.status(500).json({
              error: {
                code: 500,
                message: error.message || 'An error occurred',
              },
          });
      }
  })


const PORT = process.env.PORT || 5000

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`))
