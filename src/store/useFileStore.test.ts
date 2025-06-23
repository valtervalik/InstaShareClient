import { File } from '@/interfaces/explorer/file/file.interface';
import { FileStatusEnum } from '@/lib/constants/files.enum';
import { useFileStore } from './useFileStore';

describe('useFileStore', () => {
  const initialFile = {
    _id: '',
    filename: '',
    ref: '',
    size: 0,
    compressedSize: 0,
    status: FileStatusEnum.RAW,
  };

  beforeEach(() => {
    // Reset store state before each test
    useFileStore.setState({ file: initialFile });
  });

  describe('initial state', () => {
    it('should have correct initial file state', () => {
      const state = useFileStore.getState();
      expect(state.file).toEqual(initialFile);
    });
  });

  describe('setFile', () => {
    it('should set file correctly', () => {
      const file: File = {
        _id: '1',
        filename: 'test.txt',
        ref: 'abc123',
        size: 1024,
        compressedSize: 512,
        status: FileStatusEnum.RAW,
      };
      useFileStore.getState().setFile(file);
      expect(useFileStore.getState().file).toEqual(file);
    });

    it('should update file with different values', () => {
      const file1: File = {
        _id: '1',
        filename: 'document.pdf',
        ref: 'ref1',
        size: 2048,
        compressedSize: 1024,
        status: FileStatusEnum.RAW,
      };

      const file2: File = {
        _id: '2',
        filename: 'image.jpg',
        ref: 'ref2',
        size: 4096,
        compressedSize: 2048,
        status: FileStatusEnum.COMPRESSED,
      };

      useFileStore.getState().setFile(file1);
      expect(useFileStore.getState().file).toEqual(file1);

      useFileStore.getState().setFile(file2);
      expect(useFileStore.getState().file).toEqual(file2);
    });

    it('should handle file with zero sizes', () => {
      const file: File = {
        _id: 'empty',
        filename: 'empty.txt',
        ref: 'empty-ref',
        size: 0,
        compressedSize: 0,
        status: FileStatusEnum.RAW,
      };
      useFileStore.getState().setFile(file);
      expect(useFileStore.getState().file).toEqual(file);
    });

    it('should handle file with large sizes', () => {
      const file: File = {
        _id: 'large',
        filename: 'large-file.zip',
        ref: 'large-ref',
        size: 1000000000, // 1GB
        compressedSize: 500000000, // 500MB
        status: FileStatusEnum.COMPRESSED,
      };
      useFileStore.getState().setFile(file);
      expect(useFileStore.getState().file).toEqual(file);
    });

    it('should handle different file statuses', () => {
      const statusTests = [FileStatusEnum.RAW, FileStatusEnum.COMPRESSED];

      statusTests.forEach((status) => {
        const file: File = {
          _id: `file-${status}`,
          filename: `file-${status}.txt`,
          ref: `ref-${status}`,
          size: 1024,
          compressedSize: 512,
          status,
        };

        useFileStore.getState().setFile(file);
        expect(useFileStore.getState().file.status).toBe(status);
      });
    });

    it('should reset to initial state', () => {
      const file: File = {
        _id: '1',
        filename: 'test.txt',
        ref: 'abc123',
        size: 1024,
        compressedSize: 512,
        status: FileStatusEnum.COMPRESSED,
      };

      useFileStore.getState().setFile(file);
      expect(useFileStore.getState().file).toEqual(file);

      useFileStore.getState().setFile(initialFile);
      expect(useFileStore.getState().file).toEqual(initialFile);
    });
  });
});
