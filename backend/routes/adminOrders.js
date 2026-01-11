import express from 'express'
import { requireAuth } from '../middleware/requireAuth.js'
import { requireAdmin } from '../middleware/requireAdmin.js'
import { supabaseAdmin } from '../lib/supabaseAdmin.js'

const router = express.Router()

router.use(requireAuth)
router.use(requireAdmin)

// GET all orders
router.get('/', async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return res.status(400).json(error)
  res.json(data)
})

// UPDATE order status
router.put('/:orderId', async (req, res) => {
  const { orderId } = req.params
  const { status } = req.body

  const { error } = await supabaseAdmin
    .from('orders')
    .update({ status })
    .eq('id', orderId)

  if (error) return res.status(400).json(error)

  const { data } = await supabaseAdmin
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })

  res.json(data)
})

// UPDATE payment status
router.put('/:orderId/payment', async (req, res) => {
  const { orderId } = req.params
  const { payment_status } = req.body

  const { error } = await supabaseAdmin
    .from('orders')
    .update({ payment_status })
    .eq('id', orderId)

  if (error) return res.status(400).json(error)

  // Optionally: trigger email here if paid
  if (payment_status === 'paid') {
    // sendPaymentEmail(orderId)
  }

  const { data } = await supabaseAdmin
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })

  res.json(data)
})

export default router
