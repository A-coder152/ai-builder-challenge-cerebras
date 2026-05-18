import { describe, it, expect, vi } from 'vitest';
import { deployWithWritebacks } from '../lib/writebacks';
import * as apiClient from '../lib/api-client';

vi.mock('../lib/api-client', () => ({
  api: {
    scans: { deploy: vi.fn() },
    mock: { updateFacilities: vi.fn(), updateFinance: vi.fn() },
  }
}));

describe('writeback orchestration', () => {
  it('calls both facilities and finance updates on deploy', async () => {
    (apiClient.api.scans.deploy as any).mockResolvedValue({ asset_tag: 'C0000001' });
    
    await deployWithWritebacks({
      asset_tag: 'C0000001',
      location: { site: 'A', room: '101', row: 'R1', rack: 'K1', ru: '10' },
      user_id: 'tech-jane',
      scan_payload: 'C0000001'
    });

    expect(apiClient.api.mock.updateFacilities).toHaveBeenCalled();
    expect(apiClient.api.mock.updateFinance).toHaveBeenCalled();
  });
});
