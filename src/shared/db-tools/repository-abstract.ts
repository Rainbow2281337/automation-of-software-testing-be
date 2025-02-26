import { FilterQuery, Model } from 'mongoose';

export abstract class RepositoryAbstract<T, K> {
  constructor(protected dataModel: Model<K>) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected async create(data: T): Promise<any> {
    const dataInstance = new this.dataModel(data);

    return dataInstance.save();
  }

  protected async findMultiple(filterQuery: FilterQuery<T>): Promise<T[]> {
    return this.dataModel.find(filterQuery);
  }

  protected async findOne(filterQuery: FilterQuery<T>): Promise<T | null> {
    return this.dataModel.findOne(filterQuery);
  }

  protected async update(
    filterQuery: FilterQuery<T>,
    partialData: Partial<K>,
  ): Promise<T | null> {
    return this.dataModel.findOneAndUpdate(filterQuery, partialData, {
      new: true,
    });
  }

  protected async remove(filterQuery: FilterQuery<T>): Promise<unknown> {
    return this.dataModel.findOneAndDelete(filterQuery);
  }
}
