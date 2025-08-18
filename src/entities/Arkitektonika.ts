import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity(process.env.DB_TABLE ?? 'Arkitektonika')
export class Schematic {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'varchar', length: 100 })
    name!: string;

    @Column({ type: 'int' })
    size!: number;

    @Column({ type: 'varchar', length: 40 })
    @Index('arkitektonika_idx_sha1')
    sha1!: string;

    @Column({ type: 'varchar' })
    @Index('arkitektonika_idx_delete')
    delete!: string;

    @Column({ type: 'varchar' })
    @Index('arkitektonika_idx_download')
    download!: string;

    @Column({ type: 'int'})
    @Index('arkitektonika_idx_timestamp')
    timestamp!: number;

    @Column({ type: 'boolean', default: true })
    @Index('arkitektonika_idx_valid')
    valid!: boolean;
}
