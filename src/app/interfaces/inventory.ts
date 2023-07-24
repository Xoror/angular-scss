export interface Item {
    id: string, 
    name: string, 
    container: string,
    category: string,
    qty: number, 
    worth: number, 
    weight: number, 
    isEquipped?: boolean,
    rarity: string,
    attunable: boolean,
    attuned?: string,
    attuneRequirement: string,
    description: string[]
}

export interface ItemsCall {
    count: number,
    results: ItemCalled[]
} 

export interface ItemCalled  {
    index?: string
    name: string
    url?: string
    desc: string[]
    equipment_category: {
        index?: string
        name: string
        url?: string
    }
    weapon_category?: string
    weapon_range?: string
    category_range?: string
    range?: {
        normal: number
        long: number
    }
    damage?: {
        damage_dice?: string
        damage_type?: {
            index: string
            name?: string
            url: string
        }
    }
    two_handed_damage?: {
        damage_dice?: string
        damage_type?: {
            index: string
            name?: string
            url: string
        }
    }
    properties?: [{
        index: string
        name?: string
        url: string
    }]
    armor_category?: string
    armor_class?: any
    str_minimum?: number
    stealth_disadvantage?: boolean
    gear_category?: {
        index: string
        name: string
        url: string
    }
    cost?: {
        quantity: number
        unit: string
    }
    tool_category?: string
    vehicle_category?: string
    weight?: number
    contents?: any[]
    rarity?: {
        name: string
    }
}

export interface Container {
    [index: string]: any
}

export interface Money {
    name: string,
    shortName: string,
    value: number
}