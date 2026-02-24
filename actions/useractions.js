"use server"

import Razorpay from "razorpay"
import Payment from "@/models/Payment"
import connectDb from "../db/connectDB"
import User from "@/models/User"

export const initiate = async (amount, to_username, paymentform) => {
    await connectDb()
    
    // Find the user
    let user = await User.findOne({ username: to_username })
    
    if (!user) {
        throw new Error(`User "${to_username}" not found`)
    }
    
    // Check if user has Razorpay credentials
    if (!user.razorpayid || !user.razorpaysecret) {
        // Fallback to environment variables for testing
        const razorpayId = process.env.NEXT_PUBLIC_KEY_ID
        const razorpaySecret = process.env.KEY_SECRET
        
        if (!razorpayId || !razorpaySecret) {
            throw new Error("Razorpay credentials not configured. Please set up Razorpay in your account settings.")
        }
        
        var instance = new Razorpay({ 
            key_id: razorpayId, 
            key_secret: razorpaySecret 
        })
    } else {
        // Use user's Razorpay credentials
        var instance = new Razorpay({ 
            key_id: user.razorpayid, 
            key_secret: user.razorpaysecret 
        })
    }

    let options = {
        amount: Number.parseInt(amount),
        currency: "INR",
    }

    let x = await instance.orders.create(options)

    // Create a payment object which shows a pending payment in the database
    await Payment.create({ 
        oid: x.id, 
        amount: amount / 100, 
        to_user: to_username, 
        name: paymentform.name, 
        message: paymentform.message 
    })

    return x
}

export const fetchuser = async (username) => {
    await connectDb()
    let u = await User.findOne({ username: username })
    
    if (!u) {
        return null
    }
    
    // Convert to plain object
    let user = u.toObject()
    
    // Convert ObjectId to string
    if (user._id && user._id.toString) {
        user._id = user._id.toString()
    }
    
    // Deep serialize to remove any MongoDB objects
    return JSON.parse(JSON.stringify(user))
}

export const fetchpayments = async (username) => {
    await connectDb()
    // Find all payments sorted by decreasing order of amount
    let p = await Payment.find({ to_user: username }).sort({ amount: -1 }).limit(10).lean()
    
    // Convert to plain objects
    return p.map(payment => {
        const plainPayment = { ...payment }
        
        // Convert ObjectId to string
        if (plainPayment._id && plainPayment._id.toString) {
            plainPayment._id = plainPayment._id.toString()
        }
        
        // Convert dates to strings
        if (plainPayment.createdAt) {
            plainPayment.createdAt = new Date(plainPayment.createdAt).toISOString()
        }
        
        if (plainPayment.updatedAt) {
            plainPayment.updatedAt = new Date(plainPayment.updatedAt).toISOString()
        }
        
        return plainPayment
    })
}

export const updateProfile = async (data, oldusername) => {
    await connectDb()
    
    // Check if data is FormData or regular object
    let ndata
    if (data instanceof FormData) {
        ndata = Object.fromEntries(data)
    } else {
        ndata = data
    }

    // If the username is being updated, check if username is available
    if (oldusername !== ndata.username) {
        let u = await User.findOne({ username: ndata.username })
        if (u) {
            return { error: "Username already exists" }
        }   
        await User.updateOne({ email: ndata.email }, ndata)
        // Now update all the usernames in the Payments table 
        await Payment.updateMany({ to_user: oldusername }, { to_user: ndata.username })
    } else {
        await User.updateOne({ email: ndata.email }, ndata)
    }
    
    return { success: true }
}