import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { Bag } from '../models/Bag';

interface QueryParams {
  page?: string;
  limit?: string;
  category?: string;
  search?: string;
  minPrice?: string;
  maxPrice?: string;
  sort?: string;
}

// @desc    Get all bags (with pagination, filtering, search)
// @route   GET /api/bags
// @access  Public
export const getBags = async (req: Request<object, object, object, QueryParams>, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
      return;
    }

    const {
      page = '1',
      limit = '12',
      category,
      search,
      minPrice,
      maxPrice,
      sort = '-createdAt',
    } = req.query;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    // Build query
    const query: Record<string, unknown> = {};

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) (query.price as Record<string, number>).$gte = parseFloat(minPrice);
      if (maxPrice) (query.price as Record<string, number>).$lte = parseFloat(maxPrice);
    }

    // Execute query
    const [bags, total] = await Promise.all([
      Bag.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limitNum),
      Bag.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: bags,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error('GetBags error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching bags',
    });
  }
};

// @desc    Get single bag
// @route   GET /api/bags/:id
// @access  Public
export const getBag = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
      return;
    }

    const bag = await Bag.findById(req.params.id);

    if (!bag) {
      res.status(404).json({
        success: false,
        message: 'Bag not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: bag,
    });
  } catch (error) {
    console.error('GetBag error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching bag',
    });
  }
};

// @desc    Create bag
// @route   POST /api/bags
// @access  Private/Admin
export const createBag = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
      return;
    }

    const { name, description, price, category, image, stock } = req.body;

    const bag = await Bag.create({
      name,
      description,
      price,
      category,
      image,
      stock,
    });

    res.status(201).json({
      success: true,
      message: 'Bag created successfully',
      data: bag,
    });
  } catch (error) {
    console.error('CreateBag error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating bag',
    });
  }
};

// @desc    Update bag
// @route   PUT /api/bags/:id
// @access  Private/Admin
export const updateBag = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
      return;
    }

    const bag = await Bag.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!bag) {
      res.status(404).json({
        success: false,
        message: 'Bag not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Bag updated successfully',
      data: bag,
    });
  } catch (error) {
    console.error('UpdateBag error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating bag',
    });
  }
};

// @desc    Delete bag
// @route   DELETE /api/bags/:id
// @access  Private/Admin
export const deleteBag = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
      return;
    }

    const bag = await Bag.findByIdAndDelete(req.params.id);

    if (!bag) {
      res.status(404).json({
        success: false,
        message: 'Bag not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Bag deleted successfully',
    });
  } catch (error) {
    console.error('DeleteBag error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting bag',
    });
  }
};

// @desc    Get all categories
// @route   GET /api/bags/categories
// @access  Public
export const getCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = [
      'handbag',
      'backpack',
      'crossbody',
      'tote',
      'clutch',
      'messenger',
      'duffel',
      'laptop',
    ];

    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error('GetCategories error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching categories',
    });
  }
};
