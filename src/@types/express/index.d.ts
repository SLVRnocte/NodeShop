import { User } from '../../models/user';

declare global {
  namespace Express {
    export interface Request {
      user?: User;
    }
  }
}

// Hack
// https://stackoverflow.com/questions/57132428/augmentations-for-the-global-scope-can-only-be-directly-nested-in-external-modul
export {};
