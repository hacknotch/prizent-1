import { useState, useEffect, useCallback } from 'react';
import categoryService, { Category, CategoryTreeNode, UpdateCategoryRequest } from '../services/categoryService';

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryTree, setCategoryTree] = useState<CategoryTreeNode[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await categoryService.getAllCategories();
      if (response.success && response.categories) {
        setCategories(response.categories);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch categories');
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCategoryTree = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await categoryService.getCategoryTree();
      if (response.success && response.tree) {
        setCategoryTree(response.tree);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch category tree');
      console.error('Error fetching category tree:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createCategory = useCallback(async (name: string, parentCategoryId: number | null) => {
    setLoading(true);
    setError(null);
    try {
      const response = await categoryService.createCategory({ name, parentCategoryId });
      if (response.success) {
        await fetchCategories(); // Refresh the list
        return response;
      }
      throw new Error(response.message);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create category');
      console.error('Error creating category:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchCategories]);

  const updateCategory = useCallback(async (id: number, data: UpdateCategoryRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await categoryService.updateCategory(id, data);
      if (response.success) {
        await fetchCategories(); // Refresh the list
        return response;
      }
      throw new Error(response.message);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update category');
      console.error('Error updating category:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchCategories]);

  const deleteCategory = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await categoryService.deleteCategory(id);
      if (response.success) {
        await fetchCategories(); // Refresh the list
        return response;
      }
      throw new Error(response.message);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete category');
      console.error('Error deleting category:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchCategories]);

  const getCategoryById = useCallback((id: number): Category | undefined => {
    return categories.find(category => category.id === id);
  }, [categories]);

  const toggleCategoryStatus = useCallback(async (id: number) => {
    const category = getCategoryById(id);
    if (category) {
      await updateCategory(id, { enabled: !category.enabled });
    }
  }, [getCategoryById, updateCategory]);

  // Auto-fetch categories when hook is first used
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    categoryTree,
    loading,
    error,
    fetchCategories,
    fetchCategoryTree,
    createCategory,
    updateCategory,
    deleteCategory,
    getCategoryById,
    toggleCategoryStatus,
    categoriesCount: categories.length
  };
};

export default useCategories;
