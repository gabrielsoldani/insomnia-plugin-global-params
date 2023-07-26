// SPDX-License-Identifier: ISC

function getExcludeKey(id) {
    return `exclude_${id}`;
}

function isString(value) {
    return Object.prototype.toString.call(value) === "[object String]";
}

function throwIfNotString(key, value) {
    if (!isString(value)) {
        throw new Error(`[global-params] Expected ${key} to be a string`);
    }
}

async function setParams({ store, request }) {
    const id = request.getId();

    const isExcluded = await store.hasItem(getExcludeKey(id));
    if (isExcluded) {
        console.log(`[global-params] Skipping excluded request ${id}`);
        return;
    }

    const params = request.getEnvironmentVariable("GLOBAL_PARAMS") || {};
    for (const [key, value] of Object.entries(params)) {
        throwIfNotString(key, value);

        const url = new URL(await request.getUrl());
        if (url.searchParams.has(key) || await request.hasParameter(key)) {
            console.log(`[global-params] Skipping ${key} because it's already set`);
            continue;
        }

        await request.setParameter(key, value);
        console.log(`[global-params] Param ${key} set to ${value}`);
    }
}

const excludeRequest = {
    label: "Disable global params",
    action: async ({ store }, { request }) => {
        const id = request._id;
        await store.setItem(getExcludeKey(id), true);
        console.log(`[global-params] Excluded request ${id}`);
    },
};

const excludeRequestGroup = {
    label: "Disable global params",
    action: async ({ store }, { requests }) => {
        for (const request of requests) {
            const id = request._id;
            await store.setItem(getExcludeKey(id), true);
            console.log(`[global-params] Excluded request ${id}`);
        }
    },
};

const includeRequest = {
    label: "Enable global params",
    action: async ({ store }, { request }) => {
        const id = request._id;
        await store.removeItem(getExcludeKey(id));
        console.log(`[global-params] Included request ${id}`);
    },
};

const includeRequestGroup = {
    label: "Enable global params",
    action: async ({ store }, { requests }) => {
        for (const request of requests) {
            const id = request._id;
            await store.removeItem(getExcludeKey(id));
            console.log(`[global-params] Included request ${id}`);
        }
    },
};

exports.requestHooks = [setParams];
exports.requestActions = [excludeRequest, includeRequest];
exports.requestGroupActions = [excludeRequestGroup, includeRequestGroup];
