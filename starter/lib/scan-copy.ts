export const scanCopy = {
  duplicateReceive:
    "Already received with this serial. No duplicate asset was created.",
  serialConflict: (existing: string) =>
    `This tag already belongs to a different serial (${existing}). Stop and ask a manager before relabeling.`,
  deployIncomplete:
    "Deploy puts this asset into service, so Facilities needs a complete rack. Scan or enter site, room, row, rack, and RU.",
  storeNotService:
    "Stored. No rack record was cleared because this asset was not in service.",
  transferBadgeMissing:
    "Scan the receiving badge. The sender is already set from your current role.",
};
