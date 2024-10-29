import { renderHook, act } from '@testing-library/react-hooks';
import { useMetaMask } from './useMetaMask';
import { ethers } from 'ethers';

jest.mock('ethers');

describe('useMetaMask', () => {
  let mockEthereum: any;

  beforeEach(() => {
    mockEthereum = {
      request: jest.fn(),
      on: jest.fn(),
      removeListener: jest.fn(),
    };
    (window as any).ethereum = mockEthereum;
  });

  afterEach(() => {
    delete (window as any).ethereum;
  });

  it('should connect wallet successfully', async () => {
    const mockAddress = '0x1234567890123456789012345678901234567890';
    const mockChainId = '1';

    mockEthereum.request.mockResolvedValueOnce([mockAddress]);
    (ethers.BrowserProvider as jest.Mock).mockImplementation(() => ({
      getSigner: () => Promise.resolve({
        getAddress: () => Promise.resolve(mockAddress),
      }),
      getNetwork: () => Promise.resolve({ chainId: BigInt(mockChainId) }),
    }));

    const { result } = renderHook(() => useMetaMask());

    await act(async () => {
      await result.current.connectWallet();
    });

    expect(result.current.account).toBe(mockAddress);
    expect(result.current.chainId).toBe(mockChainId);
  });

  it('should disconnect wallet successfully', () => {
    const { result } = renderHook(() => useMetaMask());

    act(() => {
      result.current.disconnectWallet();
    });

    expect(result.current.account).toBeNull();
    expect(result.current.chainId).toBeNull();
  });

  it('should handle account changes', async () => {
    const initialAddress = '0x1234567890123456789012345678901234567890';
    const newAddress = '0x0987654321098765432109876543210987654321';

    mockEthereum.request.mockResolvedValueOnce([initialAddress]);
    (ethers.BrowserProvider as jest.Mock).mockImplementation(() => ({
      getSigner: () => Promise.resolve({
        getAddress: () => Promise.resolve(initialAddress),
      }),
      getNetwork: () => Promise.resolve({ chainId: BigInt(1) }),
    }));

    const { result } = renderHook(() => useMetaMask());

    await act(async () => {
      await result.current.connectWallet();
    });

    expect(result.current.account).toBe(initialAddress);

    act(() => {
      const accountsChangedCallback = mockEthereum.on.mock.calls.find((call: string[]) => call[0] === 'accountsChanged')[1];
      accountsChangedCallback([newAddress]);
    });

    expect(result.current.account).toBe(newAddress);
  });
});

export {};