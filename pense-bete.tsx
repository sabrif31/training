/**
 * Type inference
 */
class Poisson {
  cri() {
    return false
  }
}

class Chat {
  cri() {
    return 'miaou'
  }
}

type AnimalCri<T> = T extends { cri(): infer U } ? U : never

type A = AnimalCri<Chat>
type B = AnimalCri<Poisson>

/**
 * FeatureFlags
 */

class FeatureFlags {
  env = 'prod'
  darkMode() {
    return true
  }
  privateMode() {
    return true
  }
  nsfwMode() {
    return true
  }
}

type Colors = Record<string, [number, number, number] | string>

function demo(c: Colors) {
  //
}

const colors = {
  blue: [0, 0, 255],
  red: '#ff0000',
  green: [0, 255, 0],
} satisfies Colors

demo(colors)

/**
 * OptionsFlag
 * https://stackoverflow.com/questions/50374908/transform-union-type-to-intersection-type
 */

// Set all keys as optional
type OptionsFlag<T> = {
  [key in keyof T]+?: boolean
}
type C = OptionsFlag<FeatureFlags>

// Set all keys as readonly
type OptionsFlag2<T> = {
  +readonly [key in keyof T]: T[key] extends () => boolean ? boolean : never
}
type D = OptionsFlag2<FeatureFlags>

// Set all keys as readonly and add get prefix
type OptionsFlag3<T> = {
  +readonly [key in keyof T as `get${string &
    key}`]: T[key] extends () => boolean ? boolean : never
}
type E = OptionsFlag3<FeatureFlags>
