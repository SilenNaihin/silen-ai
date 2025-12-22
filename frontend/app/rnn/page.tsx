'use client';

import { Section1_Brain } from './components/Section1_Brain';
import { Section2_Perceptron } from './components/Section2_Perceptron';
import { Section3_Loss } from './components/Section3_Loss';
import { Section4_Backprop } from './components/Section4_Backprop';
import { Section5_Tokenization } from './components/Section5_Tokenization';
import { Section6_LanguageNN } from './components/Section6_LanguageNN';
import { Section7_Embeddings } from './components/Section7_Embeddings';
import { Section8_SimpleRecurrence } from './components/Section8_SimpleRecurrence';
import { Section9_BatchPredictions } from './components/Section9_BatchPredictions';
import { Section10_FullRNN } from './components/Section10_FullRNN';
import { Section11_TBPTT } from './components/Section11_TBPTT';
import { Section12_RNNIssues } from './components/Section12_RNNIssues';
import { Section13_LSTMBuildUp } from './components/Section13_LSTMBuildUp';
import { Section14_LSTM } from './components/Section14_LSTM';
import { Section15_Generalization } from './components/Section15_Generalization';
import { Section16_Dropout } from './components/Section16_Dropout';
import { Section17_ActivationReg } from './components/Section17_ActivationReg';
import { Section18_AWDLSTM } from './components/Section18_AWDLSTM';
import { Section19_Problems } from './components/Section19_Problems';
import { motion } from 'framer-motion';

export default function RNNPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <motion.div
        className="min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-900 via-purple-900 to-pink-900 text-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="max-w-5xl mx-auto px-8 text-center">
          <motion.h1
            className="text-7xl font-bold mb-6"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            The Evolution of Neural Networks
          </motion.h1>
          <motion.p
            className="text-3xl mb-8 text-purple-200"
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            From Perceptrons to AWD-LSTM
          </motion.p>
          <motion.p
            className="text-xl text-purple-300 max-w-3xl mx-auto mb-12"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            An interactive visual journey through the history and development of
            recurrent neural networks, exploring how we went from simple neurons
            to sophisticated language models.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
          >
            <div className="flex items-center justify-center gap-3 text-lg">
              <span>Scroll to explore</span>
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                ↓
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* All Sections */}
      <Section1_Brain />
      <Section2_Perceptron />
      <Section3_Loss />
      <Section4_Backprop />
      <Section5_Tokenization />
      <Section6_LanguageNN />
      <Section7_Embeddings />
      <Section8_SimpleRecurrence />
      <Section9_BatchPredictions />
      <Section10_FullRNN />
      <Section11_TBPTT />
      <Section12_RNNIssues />
      <Section13_LSTMBuildUp />
      <Section14_LSTM />
      <Section15_Generalization />
      <Section16_Dropout />
      <Section17_ActivationReg />
      <Section18_AWDLSTM />
      <Section19_Problems />

      {/* Footer / Conclusion */}
      <motion.div
        className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-900 via-purple-900 to-indigo-900 text-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <div className="max-w-4xl mx-auto px-8 text-center">
          <motion.h2
            className="text-6xl font-bold mb-8"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            The Journey Continues
          </motion.h2>
          <motion.p
            className="text-2xl text-purple-200 mb-8"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            From Hebb&apos;s simple observation about neurons to the
            sophisticated AWD-LSTM, we&apos;ve seen decades of innovation and
            refinement.
          </motion.p>
          <motion.div
            className="space-y-6 text-lg text-purple-300"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <p>
              Each advancement built on the previous one, adding layers of
              sophistication while solving fundamental challenges like vanishing
              gradients and overfitting.
            </p>
            <p>
              But the story doesn&apos;t end here. The limitations of RNNs and
              LSTMs—especially their sequential nature—led to the next
              revolution:{' '}
              <span className="font-bold text-white">Transformers</span>.
            </p>
            <p className="text-2xl font-semibold text-white pt-8">
              Understanding this foundation is crucial to understanding modern
              AI.
            </p>
          </motion.div>

          <motion.div
            className="mt-16 pt-8 border-t border-purple-700"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <p className="text-sm text-purple-400">
              Built with Next.js, Framer Motion, and lots of coffee ☕
            </p>
            <p className="text-xs text-purple-500 mt-2">
              © 2025 - An Interactive Neural Network Journey
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
