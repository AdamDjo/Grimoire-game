import { COUNTER_ITEM_IDS } from '@grimoire/shared'
import { z } from 'zod'

/**
 * The wire contract of the Comptoir (#249). The catalogue ids are closed here
 * too, not only in the service: an unknown id is rejected at the boundary, so
 * the client can never invent an item.
 *
 * `max(12)` on a quantity mirrors the canon bag capacity — a single line can
 * never legitimately exceed it. The real, stateful check (free slots right
 * now) still happens in `game-rules/counter.ts`; this is only a cheap bound so
 * a hostile payload cannot ask for two billion waterskins.
 */
export const counterPurchaseSchema = z.object({
  purchaseId: z.string().uuid(),
  lines: z
    .array(
      z.object({
        itemId: z.enum(COUNTER_ITEM_IDS),
        quantity: z.number().int().min(1).max(12),
      })
    )
    .min(1)
    .max(COUNTER_ITEM_IDS.length),
})
