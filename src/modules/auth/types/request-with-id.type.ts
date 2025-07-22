import { Request } from 'express';

interface RequestWithId extends Request {
  id: string;
}

export default RequestWithId;
