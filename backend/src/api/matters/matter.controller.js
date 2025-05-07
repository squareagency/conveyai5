// src/api/matters/matter.controller.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getMatters = async (req, res) => {
  try {
    const { tenantId } = req.user;
    
    const matters = await prisma.matter.findMany({
      where: {
        tenantId,
        archived_at: null
      },
      include: {
        conveyancer: true,
        buyer: true,
        seller: true
      },
      orderBy: {
        settlement_date: 'desc'
      }
    });
    
    return res.status(200).json(matters);
  } catch (error) {
    console.error('Error fetching matters:', error);
    return res.status(500).json({ error: 'Failed to fetch matters' });
  }
};

export const getMatter = async (req, res) => {
  try {
    const { id } = req.params;
    const { tenantId } = req.user;
    
    const matter = await prisma.matter.findFirst({
      where: {
        id,
        tenantId
      },
      include: {
        conveyancer: true,
        buyer: true,
        seller: true,
        documents: {
          where: {
            parent_folder_id: null
          }
        },
        todos: {
          orderBy: {
            dueDate: 'asc'
          }
        }
      }
    });
    
    if (!matter) {
      return res.status(404).json({ error: 'Matter not found' });
    }
    
    return res.status(200).json(matter);
  } catch (error) {
    console.error('Error fetching matter:', error);
    return res.status(500).json({ error: 'Failed to fetch matter' });
  }
};

export const createMatter = async (req, res) => {
  try {
    const { tenantId, id: conveyancerId } = req.user;
    const {
      matter_type,
      property_address,
      property_suburb,
      property_state,
      property_postcode,
      folio_identifier,
      property_status,
      property_value,
      settlement_date,
      buyerId,
      sellerId,
      amount,
      deposit_amount,
      deposit_paid,
      cooling_off_period
    } = req.body;
    
    const newMatter = await prisma.matter.create({
      data: {
        tenantId,
        conveyancerId,
        matter_type,
        property_address,
        property_suburb,
        property_state,
        property_postcode,
        folio_identifier,
        property_status,
        property_value,
        date: new Date(),
        settlement_date: settlement_date ? new Date(settlement_date) : null,
        buyerId,
        sellerId,
        amount,
        deposit_amount,
        deposit_paid,
        cooling_off_period,
        status: 'Pending'
      }
    });
    
    // Create audit log
    await prisma.matterAuditLog.create({
      data: {
        matterId: newMatter.id,
        userId: conveyancerId,
        tenantId,
        action: 'CREATE',
        details: JSON.stringify(newMatter)
      }
    });
    
    return res.status(201).json(newMatter);
  } catch (error) {
    console.error('Error creating matter:', error);
    return res.status(500).json({ error: 'Failed to create matter' });
  }
};

// Other controller methods (updateMatter, archiveMatter, etc.)

export const getMatterDocuments = async (req, res) => {
  try {
    const { id } = req.params;
    const { tenantId } = req.user;
    const { folderId } = req.query;
    
    const whereClause = {
      matterId: id,
      tenantId
    };
    
    if (folderId) {
      whereClause.parent_folder_id = folderId;
    } else {
      whereClause.parent_folder_id = null;
    }
    
    const documents = await prisma.document.findMany({
      where: whereClause,
      orderBy: {
        uploaded_at: 'desc'
      }
    });
    
    return res.status(200).json(documents);
  } catch (error) {
    console.error('Error fetching matter documents:', error);
    return res.status(500).json({ error: 'Failed to fetch matter documents' });
  }
};

export const getMatterDocumentFolders = async (req, res) => {
  try {
    const { id } = req.params;
    const { tenantId } = req.user;
    const { parentFolderId } = req.query;
    
    const whereClause = {
      matterId: id,
      tenantId
    };
    
    if (parentFolderId) {
      whereClause.parent_folder_id = parentFolderId;
    } else {
      whereClause.parent_folder_id = null;
    }
    
    const folders = await prisma.documentFolder.findMany({
      where: whereClause,
      orderBy: {
        name: 'asc'
      }
    });
    
    return res.status(200).json(folders);
  } catch (error) {
    console.error('Error fetching document folders:', error);
    return res.status(500).json({ error: 'Failed to fetch document folders' });
  }
};

export const createDocumentFolder = async (req, res) => {
  try {
    const { id } = req.params;
    const { tenantId, id: conveyancerId } = req.user;
    const { name, parentFolderId } = req.body;
    
    const newFolder = await prisma.documentFolder.create({
      data: {
        matterId: id,
        tenantId,
        parent_folder_id: parentFolderId || null,
        name,
        created_by: conveyancerId
      }
    });
    
    return res.status(201).json(newFolder);
  } catch (error) {
    console.error('Error creating document folder:', error);
    return res.status(500).json({ error: 'Failed to create document folder' });
  }
};