export interface SpellsCall {
    count: number,
    results: Spell[]
} 


export interface Spell {
    id: any,
    prepared?: boolean;
    index?: string,
    name: string,
    url?: string,
    desc: string[],
    higher_level?: [string],
    range: string,
    components: string[],
    material: string,
    area_of_effect: {
        size: number,
        type: string
    },
    ritual: boolean,
    duration: string,
    concentration: boolean,
    casting_time: string,
    level: number,
    attack_type?: string,
    damage?: {
        damage_at_character_level?: {
        }
        damage_at_slot_level?: {
        }
        damage_type: {
            index: string,
            name: string,
            url: string
        }
    },
    school: {
        index?: string,
        name: string,
        url?: string
    },
    classes: any[],
    subclasses?: [
        {
            index?: string,
            name: string,
            url?: string
        }
    ]
} 