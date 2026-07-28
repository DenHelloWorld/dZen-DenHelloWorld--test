import {
  SELECTED_ORDER_STORAGE_KEY,
  SELECTED_PRODUCT_STORAGE_KEY,
  SELECTED_WAREHOUSE_STORAGE_KEY,
  SELECTED_GROUP_STORAGE_KEY,
} from './storage-keys';

describe('storageKeys', () => {
  it('defines ORDER key', () => {
    expect(SELECTED_ORDER_STORAGE_KEY).toBe('orders-last-selected-id');
  });

  it('defines PRODUCT key', () => {
    expect(SELECTED_PRODUCT_STORAGE_KEY).toBe('products-last-selected-id');
  });

  it('defines WAREHOUSE key', () => {
    expect(SELECTED_WAREHOUSE_STORAGE_KEY).toBe('warehouses-last-selected-id');
  });

  it('defines GROUP key', () => {
    expect(SELECTED_GROUP_STORAGE_KEY).toBe('groups-last-selected-type');
  });
});
