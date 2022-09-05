import {createContext} from 'react'
import { handleStatLearning } from '../../../hooks/statHelper';

export const LearningContext = createContext<handleStatLearning | null>(null);

