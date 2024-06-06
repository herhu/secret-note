import { Test, TestingModule } from '@nestjs/testing';
import { SecretNoteController } from './secret-note.controller';
import { SecretNoteService } from './secret-note.service';
import { CreateSecretNoteDto, UpdateSecretNoteDto } from './dto';
import { SecretNote } from './secret-note.entity';

describe('SecretNoteController', () => {
  let controller: SecretNoteController;
  let service: SecretNoteService;

  const mockSecretNoteService = {
    create: jest.fn().mockImplementation((dto: CreateSecretNoteDto) => Promise.resolve({ id: 1, ...dto })),
    findAll: jest.fn().mockResolvedValue([{ id: 1, createdAt: new Date() }]),
    findOne: jest.fn().mockImplementation((idDto: { id: number }) => Promise.resolve('Decrypted note content')),
    findOneEncrypted: jest.fn().mockImplementation((idDto: { id: number }) => Promise.resolve(new SecretNote())),
    update: jest.fn().mockImplementation((idDto: { id: number }, dto: UpdateSecretNoteDto) => Promise.resolve({ id: idDto.id, ...dto })),
    remove: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SecretNoteController],
      providers: [{ provide: SecretNoteService, useValue: mockSecretNoteService }],
    }).compile();

    controller = module.get<SecretNoteController>(SecretNoteController);
    service = module.get<SecretNoteService>(SecretNoteService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a secret note', async () => {
    const dto: CreateSecretNoteDto = { note: 'Test note' };
    expect(await controller.create(dto)).toEqual({
      id: expect.any(Number),
      ...dto,
    });
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('should return an array of secret notes', async () => {
    expect(await controller.findAll()).toEqual([{ id: 1, createdAt: expect.any(Date) }]);
  });

  it('should return a single secret note content', async () => {
    expect(await controller.findOne(1)).toBe('Decrypted note content');
    expect(service.findOne).toHaveBeenCalledWith({ id: 1 });
  });

  it('should return a single encrypted secret note', async () => {
    expect(await controller.findOneEncrypted(1)).toEqual(new SecretNote());
    expect(service.findOneEncrypted).toHaveBeenCalledWith({ id: 1 });
  });

  it('should update a secret note', async () => {
    const dto: UpdateSecretNoteDto = { note: 'Updated note' };
    expect(await controller.update(1, dto)).toEqual({ id: 1, ...dto });
    expect(service.update).toHaveBeenCalledWith({ id: 1 }, dto);
  });

  it('should remove a secret note', async () => {
    expect(await controller.remove(1)).toBeUndefined();
    expect(service.remove).toHaveBeenCalledWith({ id: 1 });
  });
});
