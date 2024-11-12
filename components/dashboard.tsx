'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, BookOpen, FileText, Brain, Menu, ArrowLeft, Settings, LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { NoteEditor } from '@/components/notes/note-editor';
import { APISettings } from '@/components/settings/api-settings';
import { KnowledgeGraph } from '@/components/knowledge-graph/graph-view';
import { FlashcardCreator } from '@/components/flashcards/flashcard-creator';
import { QuizCreator } from '@/components/quiz/quiz-creator';

export function DashboardComponent() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('notes');
  const router = useRouter();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const sidebarVariants = {
    open: { x: 0, opacity: 1 },
    closed: { x: '-100%', opacity: 0 },
  };

  const contentVariants = {
    open: { marginLeft: '240px' },
    closed: { marginLeft: '0' },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    },
    hover: {
      scale: 1.02,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.aside
            initial="closed"
            animate="open"
            exit="closed"
            variants={sidebarVariants}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed left-0 top-0 bottom-0 w-60 bg-card p-4 z-50 border-r border-border/50"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold">Menu</h2>
              <Button variant="ghost" size="icon" onClick={toggleSidebar}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </div>
            <nav className="space-y-4">
              <Button
                variant={activeTab === 'notes' ? 'secondary' : 'ghost'}
                className="w-full justify-start transition-all duration-200"
                onClick={() => setActiveTab('notes')}
              >
                <FileText className="mr-2 h-4 w-4" />
                Notes
              </Button>
              <Button
                variant={activeTab === 'documents' ? 'secondary' : 'ghost'}
                className="w-full justify-start transition-all duration-200"
                onClick={() => setActiveTab('documents')}
              >
                <BookOpen className="mr-2 h-4 w-4" />
                Documents
              </Button>
              <Button
                variant={activeTab === 'ai' ? 'secondary' : 'ghost'}
                className="w-full justify-start transition-all duration-200"
                onClick={() => setActiveTab('ai')}
              >
                <Brain className="mr-2 h-4 w-4" />
                AI Insights
              </Button>
              <Button
                variant={activeTab === 'graph' ? 'secondary' : 'ghost'}
                className="w-full justify-start transition-all duration-200"
                onClick={() => setActiveTab('graph')}
              >
                <LinkIcon className="mr-2 h-4 w-4" />
                Knowledge Graph
              </Button>
              <Button
                variant={activeTab === 'settings' ? 'secondary' : 'ghost'}
                className="w-full justify-start transition-all duration-200"
                onClick={() => setActiveTab('settings')}
              >
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
              <Button
                variant={activeTab === 'flashcards' ? 'secondary' : 'ghost'}
                className="w-full justify-start transition-all duration-200"
                onClick={() => setActiveTab('flashcards')}
              >
                <BookOpen className="mr-2 h-4 w-4" />
                Flashcards
              </Button>
              <Button
                variant={activeTab === 'quizzes' ? 'secondary' : 'ghost'}
                className="w-full justify-start transition-all duration-200"
                onClick={() => setActiveTab('quizzes')}
              >
                <Brain className="mr-2 h-4 w-4" />
                Quizzes
              </Button>
            </nav>
          </motion.aside>
        )}
      </AnimatePresence>

      <motion.main
        className="flex-1 p-4 sm:p-8"
        initial={false}
        animate={isSidebarOpen ? 'open' : 'closed'}
        variants={contentVariants}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={toggleSidebar}>
              <Menu className="h-6 w-6" />
            </Button>
            <motion.h1 
              className="text-2xl sm:text-3xl font-bold"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Lumina Dashboard
            </motion.h1>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => router.push('/')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              as={motion.button}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              as={motion.button}
            >
              <Sparkles className="h-4 w-4" />
            </Button>
          </div>
        </header>

        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Input
            type="text"
            placeholder="Search your knowledge base..."
            className="w-full bg-card border-border/50 focus:border-primary/50"
          />
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'notes' && <NoteEditor />}
            {activeTab === 'documents' && <DocumentsTab cardVariants={cardVariants} />}
            {activeTab === 'ai' && <AIInsightsTab cardVariants={cardVariants} />}
            {activeTab === 'settings' && <APISettings />}
            {activeTab === 'graph' && <KnowledgeGraph />}
            {activeTab === 'flashcards' && <FlashcardCreator />}
            {activeTab === 'quizzes' && <QuizCreator />}
          </motion.div>
        </AnimatePresence>
      </motion.main>
    </div>
  );
}

function NotesTab({ cardVariants }) {
  return (
    <>
      {['Research Notes', 'Project Ideas', 'Literature Review'].map((title, index) => (
        <motion.div
          key={title}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          whileHover="hover"
          transition={{ delay: index * 0.1 }}
        >
          <Card className="bg-card border-border/50 h-full hover:border-primary/50 transition-colors">
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold mb-2">{title}</h3>
              <p className="text-muted-foreground">Latest updates and insights...</p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </>
  );
}

function DocumentsTab({ cardVariants }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {['Thesis Draft', 'Conference Paper', 'Research Proposal'].map((title, index) => (
        <motion.div
          key={title}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          whileHover="hover"
          transition={{ delay: index * 0.1 }}
          className="h-full"
        >
          <Card className="bg-card border-border/50 h-full hover:border-primary/50 transition-colors">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-3">{title}</h3>
              <p className="text-muted-foreground">Last edited: Recently</p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}

function AIInsightsTab({ cardVariants }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {['Content Connections', 'Summary Suggestions', 'Research Trends'].map((title, index) => (
        <motion.div
          key={title}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          whileHover="hover"
          transition={{ delay: index * 0.1 }}
          className="h-full"
        >
          <Card className="bg-card border-border/50 h-full hover:border-primary/50 transition-colors">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-3">{title}</h3>
              <p className="text-muted-foreground">AI-powered insights and analysis...</p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}