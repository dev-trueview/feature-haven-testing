
import { supabase } from '@/integrations/supabase/client';

export interface NewPropertyData {
  price: string;
  location: string;
  type: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  year_built?: number;
  description?: string;
  features: string[];
  amenities?: string[];
  neighborhood_info: any;
  image?: string;
  images?: string[];
}

export interface Property {
  id: string;
  image: string | null;
  images: string[];
  price: string;
  location: string;
  type: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  year_built?: number;
  description?: string;
  features: string[];
  amenities: string[];
  neighborhood_info: any;
  status: 'active' | 'sold' | 'pending';
  views_count: number;
  enquiries_count: number;
  created_at: string;
  updated_at: string;
}

export interface EnquiryData {
  name: string;
  email: string;
  phone: string;
  message?: string;
  property?: string;
  property_id?: string;
}

export const databaseAPI = {
  // Fetch all active properties
  async fetchActiveProperties(): Promise<Property[]> {
    try {
      console.log('Fetching active properties from Supabase...');
      
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      // Transform data to match Property interface
      const properties: Property[] = (data || []).map(item => ({
        id: item.id,
        image: typeof item.image === 'string' ? item.image : (Array.isArray(item.images) && item.images.length > 0 ? String(item.images[0]) : null),
        images: Array.isArray(item.images) ? item.images.map(img => String(img)) : (item.images ? [String(item.images)] : []),
        price: item.price,
        location: item.location,
        type: item.type,
        bedrooms: item.bedrooms,
        bathrooms: item.bathrooms,
        sqft: item.sqft,
        year_built: item.year_built,
        description: item.description,
        features: Array.isArray(item.features) ? item.features.map(f => String(f)) : [],
        amenities: Array.isArray(item.amenities) ? item.amenities.map(a => String(a)) : [],
        neighborhood_info: item.neighborhood_info || {},
        status: item.status as 'active' | 'sold' | 'pending',
        views_count: item.views_count || 0,
        enquiries_count: item.enquiries_count || 0,
        created_at: item.created_at,
        updated_at: item.updated_at
      }));

      console.log(`Successfully fetched ${properties.length} properties`);
      return properties;
    } catch (error) {
      console.error('Error fetching active properties:', error);
      return [];
    }
  },

  // Fetch all properties (admin)
  async fetchAllProperties(): Promise<Property[]> {
    try {
      console.log('Fetching all properties from Supabase...');
      
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      // Transform data to match Property interface
      const properties: Property[] = (data || []).map(item => ({
        id: item.id,
        image: typeof item.image === 'string' ? item.image : (Array.isArray(item.images) && item.images.length > 0 ? String(item.images[0]) : null),
        images: Array.isArray(item.images) ? item.images.map(img => String(img)) : (item.images ? [String(item.images)] : []),
        price: item.price,
        location: item.location,
        type: item.type,
        bedrooms: item.bedrooms,
        bathrooms: item.bathrooms,
        sqft: item.sqft,
        year_built: item.year_built,
        description: item.description,
        features: Array.isArray(item.features) ? item.features.map(f => String(f)) : [],
        amenities: Array.isArray(item.amenities) ? item.amenities.map(a => String(a)) : [],
        neighborhood_info: item.neighborhood_info || {},
        status: item.status as 'active' | 'sold' | 'pending',
        views_count: item.views_count || 0,
        enquiries_count: item.enquiries_count || 0,
        created_at: item.created_at,
        updated_at: item.updated_at
      }));

      console.log(`Successfully fetched ${properties.length} properties`);
      return properties;
    } catch (error) {
      console.error('Error fetching all properties:', error);
      return [];
    }
  },

  // Fetch property by ID
  async fetchPropertyById(id: string): Promise<Property | null> {
    try {
      console.log(`Fetching property ${id} from Supabase...`);
      
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Supabase error:', error);
        return null;
      }

      if (!data) {
        console.log('Property not found');
        return null;
      }

      // Transform data to match Property interface
      const property: Property = {
        id: data.id,
        image: typeof data.image === 'string' ? data.image : null,
        images: Array.isArray(data.images) ? data.images.map(img => String(img)) : (data.images ? [String(data.images)] : []),
        price: data.price,
        location: data.location,
        type: data.type,
        bedrooms: data.bedrooms,
        bathrooms: data.bathrooms,
        sqft: data.sqft,
        year_built: data.year_built,
        description: data.description,
        features: Array.isArray(data.features) ? data.features.map(f => String(f)) : [],
        amenities: Array.isArray(data.amenities) ? data.amenities.map(a => String(a)) : [],
        neighborhood_info: data.neighborhood_info || {},
        status: data.status as 'active' | 'sold' | 'pending',
        views_count: data.views_count || 0,
        enquiries_count: data.enquiries_count || 0,
        created_at: data.created_at,
        updated_at: data.updated_at
      };

      console.log('Successfully fetched property:', property.location);
      return property;
    } catch (error) {
      console.error('Error fetching property by ID:', error);
      return null;
    }
  },

  // Submit enquiry
  async submitEnquiry(enquiryData: EnquiryData): Promise<boolean> {
    try {
      console.log('Submitting enquiry to Supabase:', enquiryData);
      
      // Prepare the enquiry data for insertion
      const insertData = {
        name: enquiryData.name,
        email: enquiryData.email,
        phone: enquiryData.phone,
        message: enquiryData.message || null,
        property_id: enquiryData.property_id || null,
        property_details: enquiryData.property ? { property: enquiryData.property } : {}
      };

      const { error } = await supabase
        .from('enquiries')
        .insert([insertData]);

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Enquiry submitted successfully');

      // Increment enquiry count for the property if property_id is provided
      if (enquiryData.property_id) {
        try {
          // Get current count and increment
          const { data: property } = await supabase
            .from('properties')
            .select('enquiries_count')
            .eq('id', enquiryData.property_id)
            .single();
          
          if (property) {
            await supabase
              .from('properties')
              .update({ enquiries_count: (property.enquiries_count || 0) + 1 })
              .eq('id', enquiryData.property_id);
          }
        } catch (rpcError) {
          console.error('Error incrementing enquiry count:', rpcError);
        }
      }

      return true;
    } catch (error) {
      console.error('Error submitting enquiry:', error);
      return false;
    }
  },

  // Add property (admin)
  async addProperty(propertyData: NewPropertyData): Promise<boolean> {
    try {
      console.log('Adding property to Supabase:', propertyData);
      
      const { error } = await supabase
        .from('properties')
        .insert([{
          image: propertyData.image || null,
          images: propertyData.images || [],
          price: propertyData.price,
          location: propertyData.location,
          type: propertyData.type,
          bedrooms: propertyData.bedrooms,
          bathrooms: propertyData.bathrooms,
          sqft: propertyData.sqft,
          year_built: propertyData.year_built,
          description: propertyData.description,
          features: propertyData.features,
          amenities: propertyData.amenities || [],
          neighborhood_info: propertyData.neighborhood_info,
          status: 'active'
        }]);

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Property added successfully');
      return true;
    } catch (error) {
      console.error('Error adding property:', error);
      return false;
    }
  },

  // Update property (admin)
  async updateProperty(propertyId: string, propertyData: Partial<NewPropertyData>): Promise<boolean> {
    try {
      console.log('Updating property in Supabase:', propertyId, propertyData);
      
      const updateData: any = {};
      Object.keys(propertyData).forEach(key => {
        if (propertyData[key as keyof NewPropertyData] !== undefined) {
          updateData[key] = propertyData[key as keyof NewPropertyData];
        }
      });

      const { error } = await supabase
        .from('properties')
        .update(updateData)
        .eq('id', propertyId);

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Property updated successfully');
      return true;
    } catch (error) {
      console.error('Error updating property:', error);
      return false;
    }
  },

  // Delete property (admin)
  async deleteProperty(propertyId: string): Promise<boolean> {
    try {
      console.log('Deleting property from Supabase:', propertyId);
      
      // First, delete related property images from storage
      const { data: property } = await supabase
        .from('properties')
        .select('images')
        .eq('id', propertyId)
        .single();

      if (property?.images && Array.isArray(property.images)) {
        for (const imageUrl of property.images) {
          try {
            // Extract file path from URL
            if (typeof imageUrl === 'string') {
              const path = imageUrl.split('/').pop();
              if (path) {
                await supabase.storage
                  .from('property-images')
                  .remove([`properties/${path}`]);
              }
            }
          } catch (imageError) {
            console.warn('Could not delete image:', imageError);
          }
        }
      }

      // Delete the property record
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', propertyId);

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Property deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting property:', error);
      return false;
    }
  },

  // Fetch newsletter subscriptions (admin)
  async fetchNewsletterSubscriptions(): Promise<any[]> {
    try {
      console.log('Fetching newsletter subscriptions from Supabase...');
      
      const { data, error } = await supabase
        .from('newsletter_subscriptions')
        .select('*')
        .eq('is_active', true)
        .order('subscribed_at', { ascending: false });

      if (error) {
        console.error('Error fetching newsletter subscriptions:', error);
        return [];
      }

      console.log(`Successfully fetched ${data?.length || 0} newsletter subscriptions`);
      return data || [];
    } catch (error) {
      console.error('Error fetching newsletter subscriptions:', error);
      return [];
    }
  },

  // Fetch enquiries (admin)
  async fetchEnquiries(): Promise<any[]> {
    try {
      console.log('Fetching enquiries from Supabase...');
      
      const { data, error } = await supabase
        .from('enquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log(`Successfully fetched ${(data || []).length} enquiries`);
      return data || [];
    } catch (error) {
      console.error('Error fetching enquiries:', error);
      return [];
    }
  },

  // Track property view
  async trackPropertyView(propertyId: string): Promise<void> {
    try {
      console.log(`Tracking view for property ${propertyId}`);
      
      // Increment view count
      try {
        // Get current count and increment
        const { data: property } = await supabase
          .from('properties')
          .select('views_count')
          .eq('id', propertyId)
          .single();
        
        if (property) {
          await supabase
            .from('properties')
            .update({ views_count: (property.views_count || 0) + 1 })
            .eq('id', propertyId);
        }
      } catch (rpcError) {
        console.error('Error incrementing view count:', rpcError);
      }

      // Track analytics
      await supabase
        .from('property_analytics')
        .insert([{
          property_id: propertyId,
          event_type: 'view',
          user_ip: null, // Will be handled by RLS if needed
          user_agent: navigator.userAgent
        }]);

      console.log('Property view tracked successfully');
    } catch (error) {
      console.error('Error tracking property view:', error);
    }
  },

  // Upload image to Supabase storage
  async uploadImage(file: File, folder: string = 'properties'): Promise<string | null> {
    try {
      console.log(`Uploading image to Supabase storage: ${folder}`);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${folder}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('property-images')
        .upload(fileName, file);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('property-images')
        .getPublicUrl(fileName);

      console.log('Image uploaded successfully:', urlData.publicUrl);
      return urlData.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  }
};
