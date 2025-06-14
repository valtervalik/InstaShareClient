import { FileStatusEnum } from '@/lib/constants/files.enum';

export interface File {
  _id: string;
  filename: string;
  ref: string;
  size: number;
  compressedSize: number;
  status: FileStatusEnum;
}
