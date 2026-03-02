import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

// Lazy initialization: only create the client when first accessed
const prisma = new Proxy({} as PrismaClient, {
  get: (target, prop, receiver) => {
    // If it's a property we want to intercept, like the model names or $connect
    const actualClient = globalThis.prisma ??= prismaClientSingleton();
    if (process.env.NODE_ENV !== "production") globalThis.prisma = actualClient;
    
    const value = Reflect.get(actualClient, prop, receiver);
    return typeof value === 'function' ? value.bind(actualClient) : value;
  }
});

export default prisma;
