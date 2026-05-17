import { api } from "@/lib/api-client";

export const writebacks = {
  deploy: async (assetTag: string, site: string, room: string, rack: string, ru: string) => {
    await api.mock.updateFacilities({
      tagged_id: assetTag,
      rack_location: `${site}/${room}/${rack}/${rack}/${ru}`, // Using the full path as required
    });
    await api.mock.updateFinance({
      tag: assetTag,
      site: site,
      status: "capitalized",
      capitalized_on: new Date().toISOString(),
    });
  },
  deRack: async (assetTag: string) => {
    await api.mock.updateFacilities({
      tagged_id: assetTag,
      rack_location: null,
    });
  }
};
