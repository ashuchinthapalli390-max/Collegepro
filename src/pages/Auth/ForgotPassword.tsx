import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, CheckCircle2, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react'

const schema = z.object({
  email: z.string().email('Please enter a valid email address'),
})

type Inputs = z.infer<typeof schema>

export const ForgotPassword: React.FC = () => {
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm<Inputs>({
    defaultValues: { email: '' }
  })

  const onSubmit = async (data: Inputs) => {
    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setLoading(false)
    setSuccess(true)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 select-none">
      
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass-panel p-8 rounded-3xl border border-border shadow-apple-floating relative"
      >
        <div className="flex justify-center mb-6">
          <div className="p-3.5 bg-indigo-50 dark:bg-indigo-950/20 rounded-2xl">
            <Mail className="w-8 h-8 text-indigo-500" />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {!success ? (
            <motion.div
              key="request-form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="text-center space-y-2">
                <h3 className="text-xl font-black text-text-primary tracking-tight">Forgot password?</h3>
                <p className="text-xs text-text-secondary leading-relaxed font-medium">
                  Enter your email address and we'll send you an OTP link to reset your password.
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-text-secondary block">Email address</label>
                  <input
                    type="email"
                    placeholder="varun@example.com"
                    {...register('email')}
                    className={`w-full px-3.5 py-2.5 bg-muted/50 border rounded-xl text-sm focus:outline-none transition-all placeholder:text-text-secondary/50 text-text-primary ${
                      errors.email ? 'border-red-500 focus:border-red-500' : 'border-border focus:border-indigo-500'
                    }`}
                  />
                  {errors.email && (
                    <span className="text-[10px] text-red-500 font-semibold">{errors.email.message}</span>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-apple transition-colors flex items-center justify-center gap-2 text-xs"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Send Recovery OTP</span>
                      <ArrowRight size={14} />
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="success-screen"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-6"
            >
              <div className="space-y-2">
                <h3 className="text-xl font-black text-text-primary tracking-tight">Reset Link Sent</h3>
                <p className="text-xs text-text-secondary leading-relaxed font-medium">
                  We have dispatched a simulated recovery link to your inbox. Check your emails.
                </p>
              </div>

              <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 rounded-2xl text-xs font-semibold flex items-center justify-center gap-2 border border-emerald-100 dark:border-emerald-950/30">
                <CheckCircle2 size={16} />
                <span>Simulation link generated successfully.</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-8 pt-4 border-t border-border flex justify-center">
          <Link to="/login" className="flex items-center gap-1.5 text-xs font-bold text-text-secondary hover:text-text-primary transition-colors">
            <ArrowLeft size={14} />
            <span>Return to Login</span>
          </Link>
        </div>
      </motion.div>

    </div>
  )
}
