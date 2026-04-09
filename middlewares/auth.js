// Middlewaew to check userid and has premium plan

import { clerkClient } from "@clerk/express";


export const auth = async (req, res, next) => {
    try {
        const { userId, has } = req.auth;
        const hasPremiumPlan = has ? has({ role: 'premium' }) : false; // Note: You can check role instead of plan, or use another method if plan is stored differently.

        const user = await clerkClient.users.getUser(userId);
       
        if(!hasPremiumPlan && user.privateMetadata.free_usage){
            req.free_usage=user.privateMetadata.free_usage
        }
        else{
            await clerkClient.users.updateUserMetadata(userId,{
                privateMetadata : {
                    free_usage : 0
                }
            })
            req.free_usage=0;
        }
        req.plan=hasPremiumPlan ? 'premium' : 'free';
        next();
        
    } catch (error) {
       res.json({success : false , message : error.message})
    }
}