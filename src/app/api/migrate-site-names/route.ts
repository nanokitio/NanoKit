import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get all sites that don't have a name
    const { data: sitesWithoutName, error: fetchError } = await supabase
      .from('sites')
      .select('id, brand_name, industry, name')
      .is('name', null)
    
    if (fetchError) {
      console.error('Error fetching sites without name:', fetchError)
      return NextResponse.json({ error: 'Failed to fetch sites' }, { status: 500 })
    }
    
    console.log(`Found ${sitesWithoutName?.length || 0} sites without name`)
    
    // Update each site with a generated name
    const updates = []
    for (const site of sitesWithoutName || []) {
      const generatedName = `${site.brand_name || 'My Site'} - ${site.industry || 'General'} Site`
      
      const { error: updateError } = await supabase
        .from('sites')
        .update({ name: generatedName })
        .eq('id', site.id)
      
      if (updateError) {
        console.error(`Error updating site ${site.id}:`, updateError)
      } else {
        updates.push({ id: site.id, oldName: site.name, newName: generatedName })
        console.log(`Updated site ${site.id} with name: ${generatedName}`)
      }
    }
    
    return NextResponse.json({ 
      success: true, 
      message: `Updated ${updates.length} sites`,
      updates 
    })
    
  } catch (error) {
    console.error('Migration error:', error)
    return NextResponse.json({ error: 'Migration failed' }, { status: 500 })
  }
}
