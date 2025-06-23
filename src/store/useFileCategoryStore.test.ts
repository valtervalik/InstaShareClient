import { FileCategory } from '@/interfaces/explorer/file-category/file-category.interface';
import { useFileCategoryStore } from './useFileCategoryStore';

describe('useFileCategoryStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useFileCategoryStore.setState({ fileCategory: null });
  });

  describe('initial state', () => {
    it('should have fileCategory as null', () => {
      const state = useFileCategoryStore.getState();
      expect(state.fileCategory).toBeNull();
    });
  });

  describe('setFileCategory', () => {
    it('should set fileCategory correctly', () => {
      const fileCategory: FileCategory = { _id: '1', name: 'Documents' };
      useFileCategoryStore.getState().setFileCategory(fileCategory);
      expect(useFileCategoryStore.getState().fileCategory).toEqual(
        fileCategory
      );
    });

    it('should set fileCategory to null', () => {
      const fileCategory: FileCategory = { _id: '1', name: 'Documents' };
      useFileCategoryStore.getState().setFileCategory(fileCategory);
      expect(useFileCategoryStore.getState().fileCategory).toEqual(
        fileCategory
      );

      useFileCategoryStore.getState().setFileCategory(null);
      expect(useFileCategoryStore.getState().fileCategory).toBeNull();
    });

    it('should update fileCategory with different category', () => {
      const category1: FileCategory = { _id: '1', name: 'Documents' };
      const category2: FileCategory = { _id: '2', name: 'Images' };

      useFileCategoryStore.getState().setFileCategory(category1);
      expect(useFileCategoryStore.getState().fileCategory).toEqual(category1);

      useFileCategoryStore.getState().setFileCategory(category2);
      expect(useFileCategoryStore.getState().fileCategory).toEqual(category2);
    });

    it('should handle fileCategory with empty name', () => {
      const fileCategory: FileCategory = { _id: '1', name: '' };
      useFileCategoryStore.getState().setFileCategory(fileCategory);
      expect(useFileCategoryStore.getState().fileCategory).toEqual(
        fileCategory
      );
    });

    it('should handle fileCategory with special characters in name', () => {
      const fileCategory: FileCategory = {
        _id: '1',
        name: 'Category with spaces & symbols!',
      };
      useFileCategoryStore.getState().setFileCategory(fileCategory);
      expect(useFileCategoryStore.getState().fileCategory).toEqual(
        fileCategory
      );
    });
  });
});
