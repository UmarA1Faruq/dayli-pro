import {
  Apple,
  BookOpen,
  Brush,
  Coffee,
  Droplets,
  Dumbbell,
  Footprints,
  HeartPulse,
  Leaf,
  Moon,
  Music,
  Sparkles,
} from 'lucide-react'

const ICONS = {
  Apple,
  BookOpen,
  Brush,
  Coffee,
  Droplets,
  Dumbbell,
  Footprints,
  HeartPulse,
  Leaf,
  Moon,
  Music,
  Sparkles,
}

export default function HabitIcon({ name, className = 'h-5 w-5', strokeWidth = 2 }) {
  const Icon = ICONS[name] || Sparkles
  return <Icon className={className} strokeWidth={strokeWidth} />
}
