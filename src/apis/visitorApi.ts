// src/apis/visitorApi.ts
import Api from "./Api";

const COLLECTION = "visitors";

export const getVisitorCount = async (): Promise<number> => {
    const res = await Api.get(`/${COLLECTION}`);
    return res?.data?.[0]?.count ?? 0;
};

export const incrementVisitorCount = async (): Promise<number> => {
    // Get current record
    const records = await Api.get(`/${COLLECTION}`);
    const current = records?.data?.[0];

    if (!current || !current._id) {
        throw new Error("No visitor record found");
    }

    // Increment count
    const newCount = (current.count || 0) + 1;

    // Update using SQL syntax that matches your API requirements
    const response = await Api.sql(COLLECTION, {
        body: {
            sql: "UPDATE visitors SET count = ? WHERE _id = ?",
            params: [
                { count: newCount, _id: current._id }
            ] as any // Type assertion if needed
        } as any
    });

    // Or alternative PUT method:
    // const response = await Api.put(`/${COLLECTION}/${current._id}`, {
    //   body: {
    //     count: newCount
    //   }
    // });

    return newCount;
};