'use client';

import { useState, useEffect, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { FileText, Link as LinkIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(Draggable);
}

interface Suggestion {
  id: string;
  title: string;
  type: 'note' | 'document' | 'topic';
  relevance: number;
}

export function NoteEditor() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const noteCardsRef = useRef<HTMLDivElement>(null);
  
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
    ],
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none focus:outline-none min-h-[200px] p-4',
      },
    },
    content: '<p>Start writing your note here...</p>',
  });

  useEffect(() => {
    if (!editor) return;

    editor.on('update', ({ editor }) => {
      const content = editor.getText();
      if (content.length > 10) {
        simulateAISuggestions(content);
      } else {
        setSuggestions([]);
      }
    });
  }, [editor]);

  useEffect(() => {
    if (!noteCardsRef.current || typeof window === 'undefined') return;

    const cards = noteCardsRef.current.children;
    const draggables: Draggable[] = [];

    Array.from(cards).forEach((card) => {
      const draggable = Draggable.create(card, {
        type: 'x,y',
        bounds: noteCardsRef.current,
        inertia: true,
        onDragStart: () => setIsDragging(true),
        onDragEnd: () => setIsDragging(false),
        dragClickables: false,
      })[0];
      draggables.push(draggable);
    });

    return () => {
      draggables.forEach(d => d.kill());
    };
  }, []);

  const simulateAISuggestions = (content: string) => {
    // Simulate AI processing delay
    setTimeout(() => {
      const newSuggestions: Suggestion[] = [
        {
          id: '1',
          title: 'Related Research Notes',
          type: 'note',
          relevance: 0.85,
        },
        {
          id: '2',
          title: 'Similar Topic',
          type: 'topic',
          relevance: 0.75,
        },
        {
          id: '3',
          title: 'Connected Document',
          type: 'document',
          relevance: 0.65,
        },
      ];
      setSuggestions(newSuggestions);
    }, 500);
  };

  const suggestionVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 25
      }
    },
    exit: { 
      opacity: 0, 
      x: -20,
      transition: {
        duration: 0.2
      }
    }
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        <Card className="bg-card border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">New Note</h2>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => editor.commands.clearContent()}
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear
                </Button>
                <Button variant="outline" size="sm">
                  <FileText className="h-4 w-4 mr-2" />
                  Save
                </Button>
              </div>
            </div>
            
            <div className="prose-container bg-background/50 rounded-lg">
              <EditorContent editor={editor} />
            </div>
          </CardContent>
        </Card>

        <div ref={noteCardsRef} className="relative min-h-[200px]">
          <motion.div 
            className="grid gap-4 md:grid-cols-2"
            animate={{ opacity: isDragging ? 0.6 : 1 }}
          >
            {['Note 1', 'Note 2', 'Note 3'].map((note, index) => (
              <Card 
                key={note}
                className="bg-card border-border/50 cursor-move select-none"
              >
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold mb-2">{note}</h3>
                  <p className="text-muted-foreground">Drag to organize...</p>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        </div>
      </div>

      <div className="lg:col-span-1">
        <Card className="bg-card border-border/50 sticky top-4">
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold mb-4">AI Suggestions</h3>
            
            <AnimatePresence mode="wait">
              {suggestions.length > 0 ? (
                <motion.div
                  className="space-y-3"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  {suggestions.map((suggestion) => (
                    <motion.div
                      key={suggestion.id}
                      variants={suggestionVariants}
                      className="p-3 rounded-lg bg-secondary/50 hover:bg-secondary
                               transition-colors cursor-pointer"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium">{suggestion.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            Relevance: {Math.round(suggestion.relevance * 100)}%
                          </p>
                        </div>
                        <LinkIcon className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-muted-foreground text-sm"
                >
                  Start typing to see AI suggestions...
                </motion.p>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 