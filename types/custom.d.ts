/**
 * This prevents TypeScript from erroring on importing a .png asset.
 */
declare module "*.png" {
    const value: any;
    export = value;
}
