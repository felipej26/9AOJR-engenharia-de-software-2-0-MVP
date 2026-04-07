import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useAsyncResource } from '../src/hooks/use-async-resource.js';

describe('useAsyncResource', () => {
  it('inicia com loading true, sem dados e sem erro', async () => {
    let resolvePromise;
    const fetcher = vi.fn(
      () =>
        new Promise((resolve) => {
          resolvePromise = resolve;
        }),
    );

    const { result } = renderHook(() => useAsyncResource(fetcher, []));

    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
    expect(typeof result.current.reload).toBe('function');

    await act(async () => {
      resolvePromise({ ok: true });
    });
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.data).toEqual({ ok: true });
    expect(result.current.error).toBeNull();
  });

  it('após sucesso, preenche data e desliga loading', async () => {
    const payload = { items: [1, 2] };
    const fetcher = vi.fn(() => Promise.resolve(payload));

    const { result } = renderHook(() => useAsyncResource(fetcher, []));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.data).toEqual(payload);
    expect(result.current.error).toBeNull();
    expect(fetcher).toHaveBeenCalled();
  });

  it('em erro, define mensagem e desliga loading', async () => {
    const fetcher = vi.fn(() => Promise.reject(new Error('falha de rede')));

    const { result } = renderHook(() => useAsyncResource(fetcher, []));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.data).toBeNull();
    expect(result.current.error).toBe('falha de rede');
  });

  it('reload dispara nova busca e atualiza data', async () => {
    let n = 0;
    const fetcher = vi.fn(async () => {
      n += 1;
      return { call: n };
    });

    const { result } = renderHook(() => useAsyncResource(fetcher, []));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.data).toEqual({ call: 1 });

    await act(async () => {
      await result.current.reload();
    });

    await waitFor(() => expect(result.current.data).toEqual({ call: 2 }));
    expect(result.current.error).toBeNull();
    expect(fetcher.mock.calls.length).toBeGreaterThanOrEqual(2);
  });
});
